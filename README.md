# OCR AI Web
A web application that utilize LightOnOCR model to transcribe image to text.

## Todo
- [x] Create a Docker container to work in.
- [x] Get llama-cpp-python to work
- [x] Get GPU to work in it. llama.cpp doesn't need CUDA so Vulkan is fine
- [ ] Get llama-cpp-python to use noctrex/LightOnOCR-1B-1025-GGUF model
  - [ ] Test an image on it and see response
- [ ] Create a fullstack (React/FastAPI) web with pages:
  - [ ] Homepage: Upload image
  - [ ] After upload, maybe store in cache and tell user to confirm the image to be uploaded
    - Could be expanded to have cropping later
  - [ ] LightOnOCR returns result, give it to user. Find ways to prevent rambling (or it cannot read the image)
  - [ ] Dry run on your PC

This application uses components licensed under the Apache License, Version 2.0.  
© 2025 [LightOn AI](https://www.lighton.ai/)
