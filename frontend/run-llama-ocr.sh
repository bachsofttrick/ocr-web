#!/bin/bash

# Configuration
MODEL_REPO="noctrex/LightOnOCR-1B-1025-GGUF"
MODEL_FILE="lightonocr-1b-1025-q4_k_m.gguf"  # Adjust this to the specific quantization you want
MODEL_DIR="./models"
MODEL_PATH="${MODEL_DIR}/${MODEL_FILE}"
PORT=8033
GPU_LAYERS=99
HOST="127.0.0.1"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

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

# Activate virtual environment
echo -e "${GREEN}Activating virtual environment...${NC}"
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

# Check if model exists, if not download it
if [ ! -f "${MODEL_PATH}" ]; then
    echo -e "${YELLOW}Model not found. Downloading from Hugging Face...${NC}"
    echo -e "${GREEN}Using huggingface-cli to download model...${NC}"
    huggingface-cli download "${MODEL_REPO}" "${MODEL_FILE}" --local-dir "${MODEL_DIR}" --local-dir-use-symlinks False
fi

# Check if model file exists after download attempt
if [ ! -f "${MODEL_PATH}" ]; then
    echo -e "${RED}Error: Model file not found at ${MODEL_PATH}${NC}"
    exit 1
fi

echo -e "${GREEN}Model found at: ${MODEL_PATH}${NC}"

# Deactivate virtual environment
echo -e "${GREEN}Deactivating virtual environment...${NC}"
deactivate

# Find llama-server executable
LLAMA_SERVER=""
if command -v llama-server &> /dev/null; then
    LLAMA_SERVER="llama-server"
elif command -v llama.cpp/llama-server &> /dev/null; then
    LLAMA_SERVER="llama.cpp/llama-server"
elif [ -f "./llama-server" ]; then
    LLAMA_SERVER="./llama-server"
elif [ -f "./server" ]; then
    LLAMA_SERVER="./server"
else
    echo -e "${RED}Error: llama-server executable not found${NC}"
    echo "Please ensure llama.cpp is built and the server executable is in PATH or current directory"
    exit 1
fi

echo -e "${GREEN}Using llama-server: ${LLAMA_SERVER}${NC}"
echo -e "${GREEN}Starting server on port ${PORT} with ${GPU_LAYERS} GPU layers...${NC}"

# Run llama-server
"${LLAMA_SERVER}" \
    --model "${MODEL_PATH}" \
    --host "${HOST}" \
    --port "${PORT}" \
    --gpu-layers "${GPU_LAYERS}" \
    --ctx-size 4096 

# Note: Adjust the following parameters as needed:
# --ctx-size: Context size (4096 is reasonable for OCR tasks)
