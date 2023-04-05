#include <iostream>
#include <string.h>
#include <string>
#include <iomanip>

using namespace std;

class MyIntStack
{
    char *p;  // 스택 메모리로 사용할 포인터
    int size; // 스택의 최대 크기
    int tos;  // 스택의 탑을 가리키는 인덱스
public:
    MyIntStack(){size = 0, tos = -1;}
    MyIntStack(int size);
    MyIntStack(MyIntStack &s);
    MyIntStack(MyIntStack &&s);
    ~MyIntStack();

    bool push(char n); 
    bool pop(char &n); 
    void show();      
};
MyIntStack::MyIntStack(int size){
    this->size = size;
    tos = -1;
    p = new char[size];
}
MyIntStack::MyIntStack(MyIntStack &s){
    this->size = s.size;
    tos = s.tos;
    p = new char[size];
    strcpy(p,s.p);
}
MyIntStack::MyIntStack(MyIntStack &&s) {
    size = s.size;
    tos = s.tos;
    p = s.p;
    s.size = 0;
    s.tos = 0;
    s.p = nullptr;
}
MyIntStack::~MyIntStack(){
    delete[] p;
}
bool MyIntStack::push(char n){
    if(size == tos)
        return false;
    tos++;
    p[tos] = n;
    return true;
}
bool MyIntStack::pop(char &n){
    if(tos == 0)
        return false;
    n = p[tos];
    return true;
}
void MyIntStack::show(){
    for(int i =size; i >= 0; i--){
        if(p[i] != '\0')
            cout <<setw(4) <<p[i];
    }
    cout <<endl;
}


int main()
{
    MyIntStack a(20);
    a.push('a');
    a.push('f');
    a.push('k');

    cout << "== 스택(a) ==" << endl;
    a.show();

    MyIntStack b = a; // 복사 생성
    cout << endl
         << "== 스택(b) ==" << endl;
    b.push('q');
    b.show();

    char n;
    a.pop(n); // 스택 a 팝
    cout << endl
         << "스택 a에서 팝한 값 " << n << endl;
    b.pop(n); // 스택 b 팝
    cout << "스택 b에서 팝한 값 " << n << endl
         << endl;
}
