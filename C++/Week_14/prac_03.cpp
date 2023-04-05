#include <iostream>
#include <string>

using namespace std;

class Shape
{
protected:
    string name;       // 도형의 이름
    int width, height; // 도형이 내접하는 사각형
public:
    Shape(string n = "", int w = 0, int h = 0)
    {
        name = n;
        width = w;
        height = h;
    }
    virtual double getArea()
    {
        return 0;
    }
    string getName() { return name; } // 이름 리턴
};
class Oval:public Shape{
public:
    Oval(string b,int w, int h):Shape(b,w,h){}
    double getArea(){return 3.14*width*height;}
};
class Rect:public Shape{
public:
    Rect(string b, int w, int h) : Shape(b, w, h) {}
    double getArea(){return width*height;}
};
class Triangular:public Shape{
public:
    Triangular(string b, int w, int h) : Shape(b, w, h) {}
    double getArea(){return width*height/2;}
};

int main()
{
    Shape *p[3];
    p[0] = new Oval("빈대떡", 10, 20);
    p[1] = new Rect("찰떡", 30, 40);
    p[2] = new Triangular("토스트", 30, 40);
    for (int i = 0; i < 3; i++)
        cout << p[i]->getName() << " 넓이는 " << p[i]->getArea() << endl;

    for (int i = 0; i < 3; i++)
        delete p[i];
}