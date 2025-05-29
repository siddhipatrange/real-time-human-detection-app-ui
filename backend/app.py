from flask import Flask, request, jsonify
import os
import cv2
import numpy as np
import tensorflow as tf
from tensorflow import keras
import uuid
import logging
from flask_cors import CORS
import base64
from io import BytesIO
from PIL import Image
import threading
import pygame
from roboflow import Roboflow
import tempfile
from tensorflow.keras.layers import ConvLSTM2D, Dropout, Dense, BatchNormalization


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Model and preprocessing constants
SEQUENCE_LENGTH = 20
IMAGE_HEIGHT, IMAGE_WIDTH = 64, 64
MODEL_PATH = "./convlstm_model.h5"
CLASSES_LIST = ["shoot_gun", "sit", "situp", "smile", "smoke", "somersault", "stand", "swing_baseball", 
                "sword", "sword_exercise", "talk", "throw", "turn", "walk", "wave", "brush_hair", 
                "cartwheel", "catch", "chew", "clap", "climb", "climb_stairs", "dive", "draw_sword", 
                "dribble", "drink", "eat", "fall_floor", "fencing", "flic_flac", "golf", "handstand", 
                "hit", "hug", "jump", "kick", "kick_ball", "kiss", "laugh", "pick", "pour", "pullup", 
                "punch", "push", "pushup", "ride_bike", "ride_horse", "run", "shake_hands", "shoot_ball", 
                "shoot_bow"]
ALLOWED_EXTENSIONS = {".mp4", ".avi", ".mov", ".mkv"}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB

'''
# Load the pre-trained model
try:
    logger.info(f"Loading model from {MODEL_PATH}")
    model = keras.models.load_model(MODEL_PATH)
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load model: {str(e)}")
    raise
'''

# Patch ConvLSTM2D to ignore time_major if present
class PatchedConvLSTM2D(ConvLSTM2D):
    def __init__(self, *args, **kwargs):
        kwargs.pop("time_major", None)
        super().__init__(*args, **kwargs)

keras.utils.get_custom_objects()["ConvLSTM2D"] = PatchedConvLSTM2D

# Load the pre-trained model using patched ConvLSTM2D
try:
    logger.info(f"Loading model from {MODEL_PATH}")
    model = keras.models.load_model(MODEL_PATH, custom_objects={"ConvLSTM2D": PatchedConvLSTM2D, "Dropout": Dropout, "Dense": Dense, "BatchNormalization": BatchNormalization})
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load model: {str(e)}")
    raise

# Roboflow model setup for Strictly Prohibited Area
rf = Roboflow(api_key="KkeWleAwFUuyqJjTB56Y")
project = rf.workspace().project("object-detection-vyqkc")
rf_model = project.version("1").model


def allowed_file(filename):
    return os.path.splitext(filename)[1].lower() in ALLOWED_EXTENSIONS


def decode_base64_frame(base64_string):
    try:
        # Remove data URI prefix if present
        if base64_string.startswith("data:image"):
            base64_string = base64_string.split(",")[1]
        img_data = base64.b64decode(base64_string)
        img = Image.open(BytesIO(img_data))
        img = img.convert("RGB")
        img = img.resize((IMAGE_WIDTH, IMAGE_HEIGHT))
        frame = np.array(img) / 255.0
        return frame
    except Exception as e:
        logger.error(f"Error decoding base64 frame: {str(e)}")
        return None


def predict_frame_sequence(frames):
    try:
        if len(frames) != SEQUENCE_LENGTH:
            logger.warning(
                f"Invalid frame count: {len(frames)}, required: {SEQUENCE_LENGTH}"
            )
            return None, None

        processed_frames = []
        for frame in frames:
            processed_frame = decode_base64_frame(frame)
            if processed_frame is None:
                return None, None
            processed_frames.append(processed_frame)

        frames_array = np.expand_dims(processed_frames, axis=0)
        prediction = model.predict(frames_array, verbose=0)[0]
        predicted_class_index = np.argmax(prediction)
        predicted_class = CLASSES_LIST[predicted_class_index]
        confidence = float(prediction[predicted_class_index])
        logger.info(f"Prediction: {predicted_class} with confidence {confidence}")
        return predicted_class, confidence
    except Exception as e:
        logger.error(f"Error in predict_frame_sequence: {str(e)}")
        return None, None

# 🔁 Initialize the mixer ONCE globally
pygame.mixer.init()

alarm_thread = None
alarm_playing = False  # Global flag

def play_alarm_sound_loop():
    global alarm_playing
    try:
        pygame.mixer.music.load("alarm/alarm_sound.mp3")
        pygame.mixer.music.play(-1)  # -1 means loop forever
        alarm_playing = True
        logger.info("Alarm sound is now playing in loop.")
    except Exception as e:
        logger.error(f"Alarm playback failed: {str(e)}")

def stop_alarm_sound():
    global alarm_playing
    try:
        pygame.mixer.music.stop()
        alarm_playing = False
        logger.info("Alarm stopped.")
    except Exception as e:
        logger.error(f"Error stopping alarm: {str(e)}")

        
@app.route("/stop-alarm", methods=["POST"])
def stop_alarm():
    logger.info("Received stop-alarm request.")
    stop_alarm_sound()
    return jsonify({"message": "Alarm stopped."}), 200

@app.route("/predict-stream", methods=["POST"])
def predict_stream():
    logger.info("Received request to /predict-stream")
    try:
        data = request.get_json()
        if not data or "frames" not in data:
            logger.error("No frames provided")
            return jsonify({"error": "No frames provided"}), 400

        frames = data["frames"]
        if len(frames) != SEQUENCE_LENGTH:
            logger.error(f"Invalid number of frames: {len(frames)}")
            return jsonify({"error": f"Expected {SEQUENCE_LENGTH} frames"}), 400

        predicted_class, confidence = predict_frame_sequence(frames)
        if predicted_class is None:
            logger.error("Could not process frames")
            return jsonify({"error": "Could not process frames"}), 400

        return jsonify({"action": predicted_class, "confidence": confidence})
    except Exception as e:
        logger.error(f"Error processing stream request: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route("/predict", methods=["POST"])
def predict():
    logger.info("Received request to /predict")
    if "video" not in request.files:
        logger.error("No video file provided")
        return jsonify({"error": "No video file provided"}), 400

    video_file = request.files["video"]
    if video_file.filename == "":
        logger.error("No video file selected")
        return jsonify({"error": "No video file selected"}), 400

    if not allowed_file(video_file.filename):
        logger.error(f"Invalid file type: {video_file.filename}")
        return jsonify({"error": "Invalid file type. Allowed: mp4, avi, mov, mkv"}), 400

    video_file.seek(0, os.SEEK_END)
    file_size = video_file.tell()
    if file_size > MAX_FILE_SIZE:
        logger.error(f"File too large: {file_size} bytes")
        return jsonify({"error": "File too large. Maximum size is 100MB"}), 400
    video_file.seek(0)

    temp_video_path = f"temp_{uuid.uuid4()}{os.path.splitext(video_file.filename)[1]}"
    try:
        logger.info(f"Saving temporary file: {temp_video_path}")
        video_file.save(temp_video_path)

        predicted_class, confidence = predict_single_action(
            temp_video_path, SEQUENCE_LENGTH
        )
        if predicted_class is None:
            logger.error("Could not process video")
            return (
                jsonify(
                    {"error": "Could not process video. Ensure it has enough frames."}
                ),
                400,
            )

        return jsonify({"action": predicted_class, "confidence": confidence})
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    finally:
        if os.path.exists(temp_video_path):
            try:
                os.remove(temp_video_path)
                logger.info(f"Deleted temporary file: {temp_video_path}")
            except Exception as e:
                logger.error(f"Failed to delete temporary file: {str(e)}")


def frames_extraction(video_path, sequence_length, image_height, image_width):
    frames_list = []
    try:
        logger.info(f"Extracting frames from {video_path}")
        video_reader = cv2.VideoCapture(video_path)
        video_frames_count = int(video_reader.get(cv2.CAP_PROP_FRAME_COUNT))
        logger.info(f"Video has {video_frames_count} frames")

        if not video_reader.isOpened():
            logger.error(f"Failed to open video: {video_path}")
            return None

        video_frames_count = int(video_reader.get(cv2.CAP_PROP_FRAME_COUNT))
        logger.info(f"Video has {video_frames_count} frames")
        if video_frames_count < sequence_length:
            logger.warning(
                f"Video too short: {video_frames_count} frames, required: {sequence_length}"
            )
            video_reader.release()
            return None

        skip_frames_window = max(int(video_frames_count / sequence_length), 1)

        for frame_counter in range(sequence_length):
            video_reader.set(
                cv2.CAP_PROP_POS_FRAMES, frame_counter * skip_frames_window
            )
            success, frame = video_reader.read()
            if not success:
                logger.warning(f"Failed to read frame {frame_counter}")
                break
            resized_frame = cv2.resize(frame, (image_width, image_height))
            normalized_frame = resized_frame / 255.0
            frames_list.append(normalized_frame)

        video_reader.release()
        return frames_list if len(frames_list) == sequence_length else None
    except Exception as e:
        logger.error(f"Error in frames_extraction: {str(e)}")
        return None


def predict_single_action(video_path, sequence_length):
    try:
        raw_frames = frames_extraction(video_path, sequence_length, IMAGE_HEIGHT, IMAGE_WIDTH)

        # ✅ Validate extraction output
        if not raw_frames or len(raw_frames) < sequence_length:
            logger.warning("Insufficient or invalid frames extracted")
            return None, None

        frames = np.array(raw_frames)

        # ✅ Shape the frames correctly
        frames = frames[:sequence_length]
        frames = np.expand_dims(frames, axis=0)  # (1, seq_len, 64, 64, 3)

        logger.info("Running model prediction")
        prediction = model.predict(frames, verbose=0)[0]  # (num_classes,)

        for i, cls in enumerate(CLASSES_LIST):
            logger.info(f"{cls}: {prediction[i]:.4f}")

        predicted_class_index = np.argmax(prediction)
        predicted_class = CLASSES_LIST[predicted_class_index]
        confidence = float(prediction[predicted_class_index])

        logger.info(f"Prediction: {predicted_class} with confidence {confidence:.4f}")

        if confidence < 0.1:
            logger.warning("Prediction confidence too low — likely unreliable")
            return None, None

        if predicted_class in ["sword_exercise", "shoot_gun", "punch", "kick", "hit", "fencing", "climb", "smoke"]:
            logger.info("Prohibited action detected — triggering alarm sound.")
            global alarm_thread
            if alarm_playing is False:
                alarm_thread = threading.Thread(target=play_alarm_sound_loop)
                alarm_thread.start()

        return predicted_class, confidence

    except Exception as e:
        logger.error(f"Error in predict_single_action: {str(e)}")
        return None, None


# ✅ [NEW] Roboflow class ID → readable name mapping
ROBOFLOW_CLASSES = {
    "0": "person",   # Replace this with your actual label if different
    # Add more if needed, e.g. "1": "dog", "2": "car"
}

@app.route("/strict-analyze", methods=["POST"])
def analyze_strictly_prohibited_video():
    if "video" not in request.files:
        return jsonify({"error": "No video file uploaded"}), 400

    video = request.files["video"]

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_video:
        video.save(temp_video.name)
        job_id, signed_url, expire_time = rf_model.predict_video(
            temp_video.name, fps=1, prediction_type="batch-video"
        )
        results = rf_model.poll_until_video_results(job_id)

    os.remove(temp_video.name)

    human_detected = False

    # ✅ [UPDATED] Now checks mapped class name instead of raw "0"
    for frame in results['object-detection-vyqkc']:
        for prediction in frame['predictions']:
            raw_class = prediction['class']
            class_name = ROBOFLOW_CLASSES.get(raw_class, "").lower()

            logger.info(f"Detected class: {raw_class} ({class_name})")

            if class_name in ["person", "human"]:
                human_detected = True
                break
        if human_detected:
            break

    if human_detected:
        logger.info("Strict Area: Human detected — triggering alarm.")
        threading.Thread(target=play_alarm_sound_loop).start()
        return jsonify({"result": "Human detected! Alarm triggered!"})
    else:
        logger.info("Strict Area: No human detected.")
        return jsonify({"result": "No human detected."})

@app.route("/health", methods=["GET"])
def health():
    logger.info("Health check requested")
    return jsonify({"status": "Server is running"}), 200


if __name__ == "__main__":
    logger.info("Starting Flask server")
    app.run(host="0.0.0.0", port=5001, debug=True)
