#include <iostream>
#include <string>

using namespace std;

class Rect
{
    int width, height;

public:
    Rect(int width = 0, int height = 0);
    void show(string name);
    friend Rect& operator++(Rect& a);
    friend Rect operator++(Rect& a, int b);
    friend Rect operator+(int a, const Rect& b);
};
Rect::Rect(int w, int h){
    width = w;
    height = h;
}
void Rect::show(string name){
    cout <<"object "<<name<<"] width = "<< width<<",   height = "<<height<<endl;
}
Rect& operator++(Rect& a){
    a.width++;
    a.height++;
    return a;
}
Rect operator++(Rect& a, int b){
    Rect tmp = a;
    a.height++;
    a.width++;
    return tmp;
}
Rect operator+(int a, const Rect& b){
    Rect tmp = b;
    tmp.width = b.width+a;
    tmp.height = b.height + a;
    return tmp;
}

int main()
{
    Rect a(5, 12), b(4, 5);
    cout << " ==== 증가 전 객체 멤버 변수 ==== " << endl;
    a.show("a");
    b.show("b");

    cout << " ==== 증가 후 객체 멤버변수 ==== " << endl;
    ++a;     // width와 height를 1 증가
    b = a++; // width와 height를 1 증가
    a.show("a");
    b.show("b");

    cout << " ==== 3 + a 연산 후 객체 멤버변수  ==== " << endl;
    b = 3 + a; // b의 width와 height 값을 a에 3을 더한 것으로 변경
    a.show("a");
    b.show("b");
}
