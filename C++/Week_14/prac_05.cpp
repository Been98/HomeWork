#include <iostream>
#include <string>

using namespace std;

class Tool
{
    string type;

public:
    Tool() = default;
    Tool(string type) : type(type) {}
    string getType()
    {
        return type;
    }
    virtual void write()
    {
        cout << "type >> " << type << endl;
    }

    virtual void cut() = 0;//자르다
    virtual void dry() = 0; //말리다
};


class Hair:public Tool{
    string style;
public:
    Hair(string a, string b):Tool(a){
        style = b;
    }
    void write(){
        cout <<getType()<< " >> " << style <<endl;
    }
    void tint(string color){
        cout <<getType()<< "을(를) "<<color <<" 색으로 염색하다 "<< endl;
    }
    void cut(){
        cout << getType()<<" (을)를 자르다"<<endl;
    }
    void dry(){
        cout <<getType()<< " (을)를 말리다" <<endl;
    }
};
class Paper:public Tool{
    string size;
public:
    Paper(string a,string b):Tool(a){
        size = b;
    }
    virtual void write()
    {
        cout << getType() << " >> " << size << endl;
    }
    void draw(){
        cout << "크기가 "<<size<<"인 "<< getType() <<"에 그림을 그립니다"<<endl;
    }
    void cut()
    {
        cout <<getType() << " (을)를 정해진 구격으로 자르다" << endl;
    }
    void dry()
    {
        cout << getType() <<" (을)를 건조한다" << endl;
    }
};

void show(Tool& a){
    if(typeid(a) == typeid(Hair)){
        Hair& b = dynamic_cast<Hair& >(a);
        cout << "=== " << b.getType() << "클래스 "<< "===" << endl;
        b.Tool::write();
        b.write();
        b.cut();
        b.dry();
        b.tint("red");
    }
    else{
        Paper& c = dynamic_cast<Paper& >(a);
        cout << "=== " << c.getType() << "클래스 "<< "===" << endl;
        c.Tool::write();
        c.write();
        c.cut();
        c.dry();
        c.draw();
    }
}
int main()
{
    Hair h("Hair", "wave");
    Paper p("Paper", "A3");
    show(h);
    show(p);
        return 0;
}