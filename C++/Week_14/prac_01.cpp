#include <iostream>
#include <string>
#include <typeinfo>

using namespace std;

class Calculator
{
protected:
    int a, b;

public:
    Calculator(int a, int b) : a(a), b(b) {}
    virtual int calc() = 0;
    virtual void write()
    {
        cout << "a:" << a << "\tb : " << b <<" =>";
    }
};
class Adder : public Calculator
{
public:
    Adder(int a, int b):Calculator(a,b){}
    int calc(){return a+b;}
    void write() {
        cout << ">>> Adder <<<" << endl; 
        Calculator::write();
    }
    int sum(); // Adder 구현 시 추가
};
int Adder::sum(){
    int sum =0;
    for(int i =a; i <= b; i++)
        sum+= i;
    return sum;
}
class Mul : public Calculator{
public:
    Mul(int a,int b):Calculator(a,b){}
    int calc(){return a*b;}
    void write(){
        cout << ">>> Mul <<<" << endl;
        Calculator::write();
    }
};
class Manage{
public:
    static void run(){
        Calculator *c = nullptr;
        int a, b;
        int count;

        while (true)
        {
            cout << "선택하세요" << endl;
            cout << "1:add, 2:multiply, 3:finish>>";
            cin >> count;
            if (count == 3)
                break;
            cout << "정수 2 개를 입력하세요 >>";
            cin >> a >> b;
            switch (count)
            {
            case 1:
                c = new Adder(a, b);
                c->write();
                cout << c->calc() << endl
                     << "sum : ";
                if (typeid(*c) == typeid(Adder))
                {
                    Adder *ac = dynamic_cast<Adder *>(c);
                    cout << ac->sum() << endl;
                }
                break;
            case 2:
                c = new Mul(a, b);
                c->write();
                cout << c->calc() << endl;
                break;
            }
        }
        delete c;
    }
};

int main()
{
    Manage::run();
}