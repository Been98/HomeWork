#include <iostream>
#include <string>
#include <typeinfo>

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
     virtual void cut() = 0; //
     virtual void dry() = 0; //말리다
};

class Hair:public Tool{
string style;
public:
    Hair(string type, string style):Tool(type){this->style = style;}
    void tint(string color){cout << getType()<<"을(를) "<<color<<"색으로 염색하다"<<endl;}
    void write(){
        cout << "=== Hair ==="<<endl;
        Tool::write();
        cout << "style >> "<<style<<endl;
    }
    void cut(){
        cout << getType() <<"을(를) 자르다"<<endl;
    }
    void dry(){ cout <<getType()<<"을(를) 말리다"<<endl;}
};
class Paper : public Tool
{
    string size;
public:
    Paper(string type, string style) : Tool(type) { size = style; }
    void draw() { cout << getType() << "그리다."<<endl; }
    void write()
    {
        cout <<"=== Paper ==="<<endl;
        Tool::write();
        cout << "style >> " << size << endl;
    }
    void cut()
    {
        cout << getType() << "을(를) 자르다" << endl;
    }
    void dry() { cout << getType() << "을(를) 말리다" << endl; }
};

void show(Tool &a){
    a.write();
    a.cut();
    a.dry();
    if(typeid(a) == typeid(Hair)){
        Hair b = dynamic_cast<Hair &>(a);
        b.tint("red");
    }
    else if(typeid(a) == typeid(Paper)){
        Paper b = dynamic_cast<Paper &>(a);
        b.draw();
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

