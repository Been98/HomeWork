#include <iostream>
#include <string>

using namespace std;

class Circle
{
    int radius;

public:
    Circle(int radius = 0);
    void show();
    Circle& operator++();
    Circle operator++(int x);
    Circle operator+( int b);
};
Circle::Circle(int r){
    radius = r;
}
void Circle::show(){
    cout << "radius = "<< radius<<endl;
}
Circle& Circle::operator++(){
    radius++;
    return *this;
}
Circle Circle::operator++(int x){
    Circle tmp2 = *this;
    radius++;
    return tmp2;
}
Circle Circle::operator+( int b){
    Circle tmp;
    tmp.radius =  this->radius + b;
    return tmp;
}
int main()
{
    Circle a(5), b(4);
    cout << "Circle 객체 : a" << endl;
    a.show();
    cout << "Circle 객체 : b" << endl;
    b.show();
    ++a; // 반지름을 1 증가 시킨다.
    cout << "Circle 객체 : ++a" << endl;
    a.show();

    cout << "Circle 객체 : b=a++" << endl;
    b = a++; // 반지름을 1 증가 시킨다.
    cout << "Circle 객체 : a" << endl;
    a.show();
    cout << "Circle 객체 : b" << endl;
    b.show();

    b = a + 3; // b의 반지름을 a의 반지름에 1을 더한 것으로 변경
    cout << "Circle 객체 : b = a + 3" << endl;
    b.show();
}
