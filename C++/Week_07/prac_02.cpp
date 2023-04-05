#include <iostream>
#include <string>

using namespace std;

class Person{
    string name;
public :
    Person(){name = "";}
    string getName(){return name;}
    void setName(string name){this->name = name;}
};

class Family{
    Person* p;
    int size;
    string name;
    string fname;
public:
    Family(string name, int size);
    void show();
    ~Family();
};
Family:: Family(string name, int size){
    this->size = size;
    this->name = name;
    p = new Person[size];
    for(int i = 0 ; i < size; i++){
        cout << "이름을 입력하세요 >> ";
        cin >> fname;
        p[i].setName(fname);
    }
    show();
}
void Family::show(){
    cout << name<<" 가족은 다음과 같이 "<< size << "명 입니다. "<<endl;
    for(int i =0 ; i < size; i++){
        cout << i+1 << " ) "<< p[i].getName()<<endl;
    }
}
Family::~Family(){
    delete[] p;
}

int main()
{
    Family *simp;
    int size;
    string name;
    cout << "가족 수를 입력하세요 >>";
    cin >> size;
    cout << "가족명을 입력하세요 >>";
    cin >> name;
    simp = new Family(name,size);
    delete simp;
}