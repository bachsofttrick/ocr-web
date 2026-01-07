#!/bin/bash

# Configuration
MODEL_REPO="noctrex/LightOnOCR-1B-1025-GGUF"
MODEL_FILE="LightOnOCR-1B-1025-Q4_K_M.gguf"  # Adjust this to the specific quantization you want
MMPROJ_FILE="mmproj-F16.gguf"
MODEL_DIR="./models"
MODEL_PATH="${MODEL_DIR}/${MODEL_FILE}"
MMPROJ_PATH="${MODEL_DIR}/${MMPROJ_FILE}"
PORT=8033
GPU_LAYERS=99
HOST="0.0.0.0"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

download_huggingface() {
    # Activate virtual environment
    source "${VENV_DIR}/bin/activate"

    # Create models directory if it doesn't exist
    mkdir -p "${MODEL_DIR}"

    # Check if huggingface-hub is installed, install if needed
    if ! command -v huggingface-cli &> /dev/null; then
        echo -e "${YELLOW}huggingface-cli not found. Installing huggingface-hub...${NC}"
        pip install huggingface-hub
        if [ $? -ne 0 ]; then
            echo -e "${RED}Error: Failed to install huggingface-hub${NC}"
            exit 1
        fi
        echo -e "${GREEN}huggingface-hub installed successfully${NC}"
    fi
}

download_fastapi() {
    # Activate virtual environment
    source "${VENV_DIR}/bin/activate"

    # Check if fastapi is installed, install if needed
    if ! python -c "import fastapi" &> /dev/null; then
        echo -e "${YELLOW}FastAPI not found. Installing fastapi[standard]...${NC}"
        pip install "fastapi[standard]"
        if [ $? -ne 0 ]; then
            echo -e "${RED}Error: Failed to install fastapi[standard]${NC}"
            exit 1
        fi
        echo -e "${GREEN}FastAPI installed successfully${NC}"
    fi

    # Deactivate virtual environment
    deactivate
}


# Check or create virtual environment
VENV_DIR="./venv"
if [ ! -d "${VENV_DIR}" ]; then
    echo -e "${YELLOW}Virtual environment not found. Creating venv...${NC}"
    python3 -m venv "${VENV_DIR}"
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Failed to create virtual environment${NC}"
        echo "Please ensure python3-venv is installed: sudo apt install python3-venv"
        exit 1
    fi
    echo -e "${GREEN}Virtual environment created successfully${NC}"
fi

# Check if model exists, if not download it
if [ ! -d "${MODEL_DIR}" ]; then
    mkdir "${MODEL_DIR}"
fi
if [ ! -f "${MODEL_PATH}" ]; then
    echo -e "${YELLOW}Model not found. Downloading from Hugging Face...${NC}"
    echo -e "${GREEN}Using huggingface-cli to download model...${NC}"
    download_huggingface
    hf download "${MODEL_REPO}" "${MODEL_FILE}" "${MMPROJ_FILE}" --local-dir "${MODEL_DIR}"
fi

# Check if model file exists after download attempt
if [ ! -f "${MODEL_PATH}" ]; then
    echo -e "${RED}Error: Model file not found at ${MODEL_PATH}${NC}"
    exit 1
fi

echo -e "${GREEN}Model found at: ${MODEL_PATH}${NC}"

# Deactivate virtual environment
deactivate

download_fastapi

# Find llama-server executable
LLAMA_SERVER=""
if command -v llama-server &> /dev/null; then
    LLAMA_SERVER="llama-server"
elif [ -f "./llama/llama-server" ]; then
    LLAMA_SERVER="./llama/llama-server"
else
    echo -e "${RED}Error: llama-server executable not found${NC}"
    echo "Please ensure llama.cpp is built and the server executable is in PATH or in /llama"
    exit 1
fi

echo -e "${GREEN}Using llama-server: ${LLAMA_SERVER}${NC}"
echo -e "${GREEN}Starting server on port ${PORT} with ${GPU_LAYERS} GPU layers...${NC}"

# Run llama-server
"${LLAMA_SERVER}" \
    --model "${MODEL_PATH}" \
    --mmproj "${MMPROJ_PATH}" \
    --host "${HOST}" \
    --port "${PORT}" \
    --gpu-layers "${GPU_LAYERS}" \
    --ctx-size 4096 &

# Note: Adjust the following parameters as needed:
# --ctx-size: Context size (4096 is reasonable for OCR tasks)

# Build frontend
echo -e "${GREEN}Installing frontend dependencies...${NC}"
npm i
echo -e "${GREEN}Building frontend...${NC}"
npm run build

# Activate virtual environment for FastAPI
echo -e "${GREEN}Activating virtual environment for FastAPI...${NC}"
source "${VENV_DIR}/bin/activate"

# Run FastAPI server
echo -e "${GREEN}Starting FastAPI server...${NC}"
fastapi run main.py