import cv2
import csv
import datetime

e = datetime.datetime.now()

f = open('Student_name_Record', 'w')
writer = csv.writer(f)

Date = "%s/%s/%s" % (e.day, e.month, e.year)
Header = ['Date', Date]

writer.writerow(Header)

face_initializer = cv2.CascadeClassifier(cv2.data.haarcascades 
                                     + 'haarcascade_frontalface_default.xml')

webcam = cv2.VideoCapture(0)

if not webcam.isOpened():
    print("Camera unable to access!")
else:
    print("Camera accessed!")

print("Webcam started")
while True:

    data, frame = webcam.read()
    if not data:
        print("Frame couldn't be received, exiting...")
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces_data = face_initializer.detectMultiScale(
        gray,
        scaleFactor=1.3,
        minNeighbors=5,
        minSize=(100, 100),
        flags=cv2.CASCADE_SCALE_IMAGE)

    for (x, y, w, h) in faces_data:

        cv2.rectangle(frame, 
                      (x, y), 
                      (x+w, y+h),
                      (255, 0, 0),
                       2)
        
        Time = "%s:%s:%s" % (e.hour, e.minute, e.second)
        Detection = [Time, "Detected"]
        writer.writerow(Detection)
        
    cv2.imshow("Press ESC to quit this program", frame)


    key = cv2.waitKey(1)
    if key % 256 == 27:
        break
        
webcam.release()
cv2.destroyAllWindows()
print("Streaming ended")
f.close()