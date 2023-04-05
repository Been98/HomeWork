#include <iostream>
#include <string>

using namespace std;

class Person{
    string name;
public:
    Person(){name = "";}
    Person(string name){ this->name = name;}
    string getName() {return name;}
    void setName(string name) {this->name = name;}
};

class Family{
    Person* p;
    int size;
    string name;
public:
    Family(string name,int size);
    void show();
    void setName(int i,string name);
    ~Family();
};
Family::Family(string name, int size){
    this->name = name;
    this->size = size;
    p = new Person[size];
}
void Family::show(){
    cout << name <<" 가족은 다음과 같이 "<<size<<"명 입니다."<<endl;
    for(int i = 0; i < size; i++){
        cout<<i+1<<" ) "<<p[i].getName()<<endl;
    }
}
void Family::setName(int i,string name){
    p[i].setName(name);
}
Family::~Family(){
    delete[] p;
}

int main()
{
    Family *simpson;
    string name;
    int size;
    cout << "가족 수를 입력하세요 >>";
    cin >> size;
    cout << "가족명을 입력하세요 >>";
    cin >> name;
    simpson = new Family(name, size);
    cin.ignore();
    for(int i =0; i < size; i++){
        cout << "이름을 입력하세요 >> ";
        cin >> name;
        simpson->setName(i,name);
    }
    simpson->show();
    delete []simpson;
    return 0;
}