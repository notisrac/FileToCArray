# File to C array converter
Coverts any file to a C style array.
Useful if you want to embed a file (binary, text, image, whatever) into your code!
Use it for your Arduino or other embedded projects.

Just select a file, specify the array format and click convert. It will give you the contents of the file in the specified format, that you can embed into your code.
Supported formats:
 - Hex (0x00)
 - Hex with trailing slash (\x00)
 - Decimal (000)
 - Binary (B00000000)

## It can also do image color format and size coversion!
If you select an image file, it will recognise it, and show you the image conversion settings panel.
 - Change palette:
   - 32 bit RGBA (4bytes/pixel)
   - 24bit RGB (3bytes/pixel)
   - 16bit RRRRRGGGGGGBBBBB (2byte/pixel)
   - 15bit RRRRRGGGGGBBBBBA (2byte/pixel)
   - 8bit RRRGGGBB (1byte/pixel)
   - 8bit grayscale (1byte/pixel)
   - 1bit line art (1bit/pixel)
 - Resize the image
   - Keep the original aspect ratio
   - Modify the sizes freely


## Example
We take Google's favicon:

![Google's favicon](https://www.google.hu/favicon.ico "Google's favicon")

Convert it down to 16x* size (keeping the aspect ratio), 8bit grayscale, with hex output (0x..), and the result is like this:
```c
#define FAVICON_HEIGHT 16
#define FAVICON_WIDTH 16

// array size is 256
static const unsigned char favicon[] PROGMEM  = {
  0x00, 0x00, 0x00, 0x00, 0xff, 0xfd, 0xfd, 0xfd, 0xfd, 0xfd, 0xfd, 0xff, 0x00, 0x00, 0x00, 0x00, 
  0x00, 0x00, 0xfe, 0xfd, 0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xfd, 0xfd, 0xfe, 0x00, 0x00, 
  0x00, 0xfe, 0xfc, 0xff, 0xfa, 0xc1, 0x90, 0x79, 0x79, 0x8f, 0xc0, 0xfa, 0xff, 0xfd, 0xfe, 0x00, 
  0x00, 0xfd, 0xff, 0xee, 0x8d, 0x76, 0x76, 0x76, 0x76, 0x76, 0x76, 0x9b, 0xff, 0xff, 0xfd, 0x00, 
  0xff, 0xfe, 0xfa, 0x8c, 0x76, 0x7a, 0xb7, 0xdf, 0xdf, 0xb7, 0x88, 0xea, 0xff, 0xff, 0xfd, 0xf9, 
  0xfd, 0xff, 0xca, 0x79, 0x79, 0xdf, 0xff, 0xff, 0xff, 0xff, 0xfd, 0xff, 0xff, 0xff, 0xff, 0xfd, 
  0xfd, 0xff, 0xa8, 0x91, 0xb5, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xfd, 
  0xfd, 0xff, 0x96, 0x94, 0xdf, 0xff, 0xff, 0xff, 0x93, 0x93, 0x93, 0x93, 0x93, 0xb3, 0xff, 0xfd, 
  0xfd, 0xff, 0x96, 0x94, 0xdf, 0xff, 0xff, 0xff, 0x93, 0x93, 0x93, 0x93, 0x93, 0xaf, 0xff, 0xfd, 
  0xfd, 0xff, 0xa9, 0x8f, 0xb0, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xb8, 0x93, 0xbd, 0xff, 0xfd, 
  0xfd, 0xff, 0xc8, 0x69, 0x68, 0xd9, 0xff, 0xff, 0xff, 0xff, 0xe9, 0x96, 0x93, 0xdc, 0xff, 0xff, 
  0xff, 0xfd, 0xfa, 0x7f, 0x65, 0x69, 0xac, 0xd9, 0xdb, 0xb3, 0x7e, 0x92, 0xa8, 0xfd, 0xfd, 0xf9, 
  0x00, 0xfd, 0xff, 0xed, 0x80, 0x65, 0x65, 0x65, 0x65, 0x65, 0x65, 0x82, 0xf1, 0xff, 0xfd, 0x00, 
  0x00, 0xfe, 0xfd, 0xff, 0xfa, 0xba, 0x84, 0x69, 0x69, 0x80, 0xb4, 0xf7, 0xff, 0xfd, 0xff, 0x00, 
  0x00, 0x00, 0xfe, 0xfd, 0xfd, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xfd, 0xfd, 0xff, 0x00, 0x00, 
  0x00, 0x00, 0x00, 0x00, 0xf9, 0xfd, 0xfd, 0xfd, 0xfd, 0xfd, 0xff, 0xf9, 0x00, 0x00, 0x00, 0x00
};
```


## JSArrayTest.html
Tests the speed of different array manipulation techniques in javascript


## See it in acton here [https://notisrac.github.io/FileToCArray](https://notisrac.github.io/FileToCArray)


