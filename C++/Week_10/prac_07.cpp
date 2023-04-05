#include <iostream>
#include <string>

using namespace std;

class MyIntStack
{
    char *p;  // 스택 메모리로 사용할 포인터
    int size; // 스택의 최대 크기
    int tos;  // 스택의 탑을 가리키는 인덱스
public:
    MyIntStack() = default;
    MyIntStack(int size){
        this->size = size;
        p = new char[size];
        tos = -1;
    }
    MyIntStack(MyIntStack &s){
        size = s.size;
        p = new char[size];
        tos = s.tos;
        for(int i = 0; i <size; i++){
            p[i] = s.p[i];
        }
    }
    ~MyIntStack(){
        if(p)
            delete[] p;
    }

    bool push(char n){
        if(tos > size)
            return false;
        tos++;
        p[tos] = n;
        return true;
    } // 정수 n을 스택에 푸시,스택이 꽉 차 있으면 false를, 아니면 true 리턴
    bool pop(char &n){
        if(tos == -1)
            return false;
        n = p[tos];
        tos--;
        return true;
    } // 스택의 탑에 있는 값을 n에 팝, 만일 스택이 비어 있으면 false를, 아니면 true 리턴
    void show(){
        for(int i = tos; i >= 0; i--){
            cout << p[i] <<'\t';
        }
        cout <<endl;
    }      //스택에 저장된 모든 문자 출력
};
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