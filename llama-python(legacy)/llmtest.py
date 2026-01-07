from llama_cpp import Llama
from llama_cpp.llama_chat_format import Llava15ChatHandler
import base64
import json
import os

def jpg_to_base64(image_path):
    """
    Converts a JPG image file to a Base64 encoded string.
    """
    if not os.path.exists(image_path):
        raise Exception(f"Error: File not found at {image_path}")

    # Open the image file in binary read mode ('rb')
    with open(image_path, "rb") as image_file:
        # Read the file's binary content and encode it to Base64
        encoded_bytes = base64.b64encode(image_file.read())
        # Decode the bytes to a standard UTF-8 string
        base64_string = encoded_bytes.decode("utf-8")
        return base64_string

os.system('clear')

# Import mmproj for vision part of the multimodal
chat_handler = Llava15ChatHandler(
    clip_model_path='/app/models/mmproj-Qwen2-VL-2B-Instruct-f16.gguf'
)

llm = Llama(
    model_path='/app/models/Qwen2-VL-2B-Instruct-Q4_K_M.gguf',
    n_gpu_layers=99,
    n_ctx=0,
    chat_handler=chat_handler,
    verbose=False
)

dataimage = 'data:image/jpeg;base64,' + jpg_to_base64('/app/motivational-quote-for-inspirataion.jpg')

output = llm.create_chat_completion(
    messages=[
        {
            "role": "system",
            "content": "Extract text from image"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": dataimage
                    }
                }
            ]
        }
    ]
)

print(json.dumps(output, indent=2))