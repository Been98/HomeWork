#include <iostream>
#include <string>

using namespace std;

class Member{
    string id;
    string pw;
public:
    Member();
    Member(string a);
    Member(string a,string b);
    void disPlay();
    bool isCheck();
};
Member::Member(){
    id = "null";
    pw = "null";
}
Member::Member(string a){
    id = a;
    cout << "매개변수가 하나인 Member 생성자 입니다."<<endl<<"pw 입력 >>";
    cin >> pw;
}
Member::Member(string a,string b){
    id = a;
    pw = b;
}
void Member::disPlay(){
    cout << "id >>" <<id <<endl;
    cout << "pw >>" << pw<<endl;
    cout <<endl;
}
bool Member::isCheck(){
    if(id == pw)
        return false;
    return true;
}

int main()
{
    Member mem;
    Member mem1("C++", "C++");
    Member mem2("Java1");
    mem.disPlay();
    mem1.disPlay();
    if (mem1.isCheck())
        cout << "사용 가능한 pw 입니다" << endl;
    else
        cout << "id와 동일한 pw는 사용할 수 없습니다" << endl;
    mem2.disPlay();
    return 0;
    
}