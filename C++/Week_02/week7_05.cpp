#include <iostream>
#include <memory>

using namespace std;

class Employee{
    int year;
    string name;
    string dept;
public:
    Employee(){;}
    void setEmployee(string name,string dept, int year);
    int getYear(){return year;}
    string getName(){return name;}
    string getDept(){return dept;}
    void disPlay();
    ~Employee();
};
void Employee::setEmployee(string name, string dept, int year){
    this->name = name;
    this->dept = dept;
    this->year = year;
}

void Employee::disPlay(){
    cout << "name :"<<name<<" dept : "<<dept<<" year : "<<year<<endl;
}

Employee::~Employee(){
    cout <<name <<" 객체 소멸"<<endl;
}

class Manager{
    unique_ptr<Employee[]> p;
    int size;
    string name;
    string dept;
    int year;
public:
    Manager(int size);
    ~Manager();
    void searchByName();
    void searchByYear();
};
Manager::Manager(int size){
    this->size = size;
    p = make_unique<Employee[]>(size);
    for (int i = 0; i < size; i++)
    {
        cout << "사원 " << i + 1 << "의 이름과 소속, 입사연도를 입력하세요 >>";
        cin >> name;
        cin >> dept;
        cin >> year;
        p[i].setEmployee(name,dept,year);
    }
}
void Manager::searchByName(){
    cout << "검색하고자 하는 사원의 이름 >>";
    cin >> name;
    for(int i = 0; i < size; i ++){
        if(p[i].getName() == name){
            p[i].disPlay();
        }
    }
}
void Manager::searchByYear(){
    int count = 0;
    cout << "입사 연도를 입력하세요 >>";
    cin >> year;
    cout <<year <<"이후에 입사한 사원을 검색합니다. "<<endl;
    for(int i = 0; i < size; i ++){
        if(p[i].getYear() > year){
            cout << i+1 <<" ] ";
            p[i].disPlay();
            count++;
        }
    }
    cout << year<<"이후에 입사한 사원은 "<<count<<" 명 입니다."<<endl;
}
Manager::~Manager(){
    cout << "객체 소멸"<<endl;
}

int main()
{
    int size;
    Manager *pManager;
    cout << "사원수를 입력하세요 >>";
    cin >> size;
    if(size <= 0){
        cout << "양수를 입략하세여."<<endl;
        return 0;
    }
    pManager = new Manager(size);
    pManager->searchByName();
    pManager->searchByYear();

    delete pManager;
    return 0;
}
