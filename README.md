# File to C array converter
Coverts any file to a C style array.
Useful if you want to embed a file (binary, text, image, whatever) into your code!

Just select a file, specify the array format and click convert. It will give you the contents of the file in the specified format, that you can embed into your code.
Supported formats:
 - Hex (0x00)
 - Hex with trailing slash (\x00)
 - Decimal (000)
 - Binary (B00000000)


**It can also do image color format and size coversion!**
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

**JSArrayTest.html**
Tests the speed of different array manipulation techniques in javascript

## See it in acton here [https://notisrac.github.io/FileToCArray/index.html](https://notisrac.github.io/FileToCArray/index.html)


[![Analytics](https://ga-beacon.appspot.com/UA-122950438-1/FileToCArray)](https://github.com/igrigorik/ga-beacon)
