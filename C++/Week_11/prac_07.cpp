#include <iostream>
#include <string>
#include <ctime>
#include <cstdlib>

using namespace std;

class Person
{
    string name;

public:
    Person(string name) { this->name = name; }
    string getName() { return name; }
    bool go(); // 정수를 입력 받고 정답이면 승리, true 리턴
};
class UpAndDownGame
{
    static int answer; //맞춰야 할 답, 난수로 초기화
    static int top;    //맞춰야 할 답의 범위에서 최고값
    static int bottom; //맞춰야 할 답의 범위에서 최저값
public:
    static void run();             // 게임 진행
    static bool check(int answer); // top과 bottom을 조절하고, 정답을 맞추었으면 true 리턴
};
int UpAndDownGame::top =100;
int UpAndDownGame::bottom = 1;
int UpAndDownGame::answer = 0;
bool Person::go()
{

    int result;
    cout << name << " >> ";
    cin >> result;
    bool f = UpAndDownGame::check(result);
    return f;
}
void UpAndDownGame::run(){
    srand(time(nullptr));
    string a;
    string b;
    string result;
    answer =rand() % 100;
    bool flag = false;
    cout << "Up & Down 게임을 시작합니다. " << endl;
    cout << "이름을 입력하세요 >> ";
    cin >> a;
    cout << "이름을 입력하세요 >> ";
    cin >> b;
    Person p1(a);
    Person p2(b);
    while(!flag){
        cout << "답은 " << bottom << "과 " << top << "사이에 있습니다." << endl;
        result = a;
        flag = p1.go();
        if(flag)
            break;
        cout << "답은 " << bottom << "과 " << top << "사이에 있습니다." << endl;
        result = b;
        flag = p2.go();
    }
    if(result == a){
        cout<<p1.getName()<<"이 이겼습니다."<<endl;
    }
    else
        cout << p2.getName() << "이 이겼습니다." << endl;
}
bool UpAndDownGame::check(int a){
    if(answer == a){
        return true;
    }
    else{
        if(answer > a)
            bottom = a;
        else
            top = a;
    }
    return false;
}
int main()
{
    UpAndDownGame::run();
}