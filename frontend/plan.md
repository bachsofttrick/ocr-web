I want you to create a React app with 3 pages:
- Page 1 (homepage): There is an upload icon in the middle of the page. When pressing the icon, we can choose an image to upload. The image will be converted to base64 on the browser, then switch to the next page.
- Page 2: We get to see the image to confirm whether it is the correct image. We can crop of resize the image to make it smaller. When resizing or cropping, update the base64 representation of the image. Press Confirm to continue.
Image will be send to <api url>/v1/chat/completions as POST: 
```
messages:[
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
                "url": <base64 of the image>
            }
        }
    ]
}]
```
Afterward, we wait for the server response like this:
```
{
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I assist you today?"
      }
    }
  ]
}
```
Get the response from choices[0].message.content. Move to page 3
- Page 3: The response is used as the answer of the image. So show both the image(small) and the answer in a text box.

