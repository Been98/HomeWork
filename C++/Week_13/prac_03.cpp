#include <iostream>
#include <string>

using namespace std;

class Circle
{
    int radius;

public:
    Circle(int radius = 0) { this->radius = radius; }
    int getRadius() { return radius; }
    void setRadius(int radius) { this->radius = radius; }
    double getArea() { return 3.14 * radius * radius; };
};
class NamedCircle:public Circle{
    string p;
public:
    NamedCircle() = default;
    void setName(string a);
    string getName(){return p;}

};
void NamedCircle::setName(string a){
    p = a;
}
string max();
NamedCircle c[5];

string max(){
    int max = 0;
    int count;
    for(int i = 0; i < 5; i++){
        if(max < c[i].getArea()){
            count = i;
            max = c[i].getArea();
        }
    }
    return c[count].getName();
}
int main()
{
    cout << "5 개의 정수 반지름과 원의 이름을 입력하세요 "<<endl;
    int radius;
    string pizza;
    for(int i =0; i < 5; i++){
        cout <<i+1<<">> ";
        cin >> radius;
        c[i].setRadius(radius);
        cin >> pizza;
        c[i].setName(pizza);
    }
    cout << "가장 면적이 큰 피자는 "<<max()<<"입니다."<<endl;
}