import sys
from PIL import Image

def remove_background(input_path, output_path, tolerance=30):
    img = Image.open(input_path).convert('RGBA')
    datas = img.getdata()
    
    # Get the color of the top-left pixel to use as the background color to remove
    bg_color = img.getpixel((0, 0))
    
    newData = []
    for item in datas:
        if (abs(item[0] - bg_color[0]) <= tolerance and
            abs(item[1] - bg_color[1]) <= tolerance and
            abs(item[2] - bg_color[2]) <= tolerance):
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(output_path, 'PNG')
    print('Done')

remove_background(
    r'C:\Users\aavkj\.gemini\antigravity\brain\b1a64dcb-54c6-4c03-9c43-05999b9b823a\media__1784551830872.png',
    r'C:\Users\aavkj\Desktop\GitHub Website\ajainx1.github.io\src\app\icon.png',
    30
)
