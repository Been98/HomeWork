#include <iostream>
#include <string>
#include <vector>

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
void UpAndDownGame::run(){
    string a;
    vector<Person> v;
    for(int i = 0; i < 2; i++){
        cout << "이름 :";
        cin>> a;
        v.push_back(Person(a));
        
    }
    
}
int main()
{
    UpAndDownGame::run();
}
