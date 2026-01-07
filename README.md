# OCR AI Web
A web application that utilize LightOnOCR model to transcribe image to text.
Dependencies: [llama.cpp](https://github.com/ggml-org/llama.cpp) Vulkan binaries (put in /llama).

First, make sure that nodeJS is installed. If not, use `install-node.sh` (sourced from nodejs.org).  
Run `run-llama-ocr.sh` to start the server.

Note on llama-cpp-python being legacy:  
llama-cpp-python gets stuck easily, it doesn't work for vision. I tested this on
LightOnOCR and Qwen2-VL model.  
Switching to sending JSON to OpenAI API of llama.cpp (/v1/chat/completions) is much better. 