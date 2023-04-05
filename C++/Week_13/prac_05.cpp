#include <iostream>
#include <string>

using namespace std;

class Date{
    string name;

public:
    Date() = default;
    Date(int a, int b, int c);
    string getName();
};
Date::Date(int a, int b, int c){
    name = to_string(a) + "/" + to_string(b) + "/" + to_string(c);
}
string Date::getName(){
    return name;
}

class Employee{
    string name;
    int number;
    Date birthdate;
    Date datehired;
public:
    Employee(string a, int b, Date c, Date d);
    void print();
};
Employee::Employee(string a,int b, Date c,Date d){
    name = a;
    number = b;
    birthdate = c;
    datehired = d;
}
void Employee::print(){
    cout<< "이름 : "<< name <<endl << "사원번호 : "<<number<<endl;
    cout<<"사원번호 : "<<birthdate.getName()<<endl<<"입사일 : "<<datehired.getName()<<endl;
}

class Salaried : public Employee{
    double salary;
    int annualbonus;
public :
    Salaried(string a,int b,Date c,Date d,double e,int f);
    void print();
};
Salaried::Salaried(string a, int b, Date c, Date d, double e, int f):Employee(a,b,c,d){
    salary = e;
    annualbonus = f;
}
void Salaried::print()
{
    Employee::print();
    cout << "급여 :" << salary << endl;
    cout << "보너스 : " << annualbonus << "%" << endl;
}
class Hourly : public Employee
{
    double hourlywage;
    int overtimerate;
public:
    Hourly(string a, int b, Date c, Date d, double e, int f);
    void print();
};
Hourly::Hourly(string a,int b,Date c, Date d, double e, int f):Employee(a,b,c,d){
    hourlywage = e;
    overtimerate = f;
}
void Hourly::print(){
    Employee::print();
    cout << "시급 " << static_cast<int>(hourlywage)<<endl;
    cout << "초과 근무에 대한 추가 시급 비율 : "<<overtimerate<<"%"<<endl;
}
int main()
{
    cout << ">> Salaried employee 정보 <<" << endl;
    Date birth1(5, 10, 1985); //생년월일
    Date hired1(2, 15, 2010); //입사일
    Salaried smith("펭수", 100, birth1, hired1, 1500.00, 10);
    smith.print();
    cout << endl<< endl;

    cout << ">> Hourly employee 정보 <<" << endl;
    Date birth2(4, 15, 1990); //생년월일
    Date hired2(8, 15, 2008); //입사일
    Hourly howard("둘리", 101, birth2, hired2, 25.00, 75);
    howard.print();
    cout << endl<< endl;
    return 0;
}
