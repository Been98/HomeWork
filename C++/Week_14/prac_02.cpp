#include <iostream>
#include <string>

using namespace std;

class AbstractGate
{
public:
    virtual bool operation(bool x, bool y) = 0; // 순수 가상 함수
};
class ANDGate : public AbstractGate{
public:
   bool operation(bool x, bool y){
           return x&&y; 
    }
};
class ORGate : public AbstractGate
{
public:
    bool operation(bool x, bool y){
        return x||y;
    }
};
class XORGate : public AbstractGate
{
public:
    bool operation(bool x, bool y){
        return x^y;
    }
};

class Manage{
public:
    static void go(){
        AbstractGate *ag = nullptr;
        int a = 0;
        bool x, y;
        while (true)
        {
            cout << "연산 종류를 선택하세요 1.and, 2.or, 3.xor, 4. stop >>";
            cin >> a;
            if(a == 4){
                break;
            }
            cout << "게이트 입력 값 >> ";
            cin >> x >> y;
            switch (a)
            {
            case 1:
                ag = new ANDGate();
                cout << "AND : " << boolalpha << x << " " << y << " => " << ag->operation(x, y) << endl;
                break;
            case 2:
                ag = new ORGate();
                cout << "OR : " << boolalpha << x << " " << y << " => " << ag->operation(x, y) << endl;
                break;
            case 3:
                ag = new XORGate();
                cout << "XOR : " << boolalpha << x << " " << y << " => " << ag->operation(x, y) << endl;
                break;
            }
            delete ag;
        }
    }
};



int main()
{
    Manage::go();
}