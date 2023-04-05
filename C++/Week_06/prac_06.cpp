#include <iostream>
#include <string>

using namespace std;

class Person
{
    string name;

public:
    Person(){;}
    Person(string name) { this->name = name; }
    string getName() { return name; }
    void setName(string name) {this->name = name; }
};

class Family
{
    Person *p; // Person 배열 포인터
    int size;  // Person 배열의 크기. 가족 구성원 수
    string fname;
    string name;
public:
    Family(string name, int size); // size 개수만큼 Person 배열 동적 생성
    void show();                   // 모든 가족 구성원 출력
    ~Family();
};
Family :: Family(string name, int size){
    this->size = size;
    this->name = name;
    p = new Person[size];
    for(int i = 0; i < size; i++){
        cout<<"이름을 입력하세요 >> ";
        cin >> fname;
        p[i].setName(fname);
    }
    show();
}
void Family::show(){
    cout<<name<<" 가족은 다음과 같이 "<<size <<"명 입니다."<<endl;
    for(int i =0; i < size; i ++){
        cout << i+1 <<" ) "<<p[i].getName()<<endl;
    }
}
Family::~Family(){
    delete[] p;
}

int main()
{
    int size;
    string name;
    Family *simpson;
    cout << "가족 수를 입력하세요 >> ";
    cin >> size;
    cout << "가족명을 입력하세요 >>";
    cin >> name;
    simpson = new Family(name, size);


    delete simpson;
}