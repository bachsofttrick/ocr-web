# OCR AI Web
A web application that utilize LightOnOCR model to transcribe image to text.
This application uses components licensed under the Apache License, Version 2.0.  

## Todo
- [x] Create a Docker container to work in.
- [x] Get llama-cpp-python to work
- [x] Get GPU to work in it. llama.cpp doesn't need CUDA so Vulkan is fine
- [!] Get llama-cpp-python to use [noctrex/LightOnOCR-1B-1025-GGUF](https://huggingface.co/noctrex/LightOnOCR-1B-1025-GGUF) model
  - [!] Test an image on it and see response
- [x] Create a fullstack (React/llama.cpp) web with pages:
  - [x] Homepage: Upload image
  - [x] After upload, store in cache and tell user to confirm the image and whether to resize/crop it
  - [x] LightOnOCR returns result, give it to user.
  - [x] Dry run on your PC

llama-cpp-python gets stuck easily, doesn't work. And this was on Qwen2-VL model.
Switching to sending JSON to OpenAI API of llama.cpp (/v1/chat/completions).
That works much better. 
