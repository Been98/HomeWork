
#include<iostream>
#include <string>

    using namespace std;

class Person
{
    string name;

public:
    Person() { ; }
    Person(string name) { this->name = name; }
    string getName() { return name; }
    void setName(string name) { this->name = name; }
};
class Family
{
    Person *p;
    string fname;
    string faname;
    int size;

public:
    Family();
    Family(string name, int size);
    void show();
    ~Family();
};
Family::Family()
{
    cout << "가족 수를 입력하세요 >>";
    cin >> size;
    cout << "가족명을 입력하세요 >>";
    cin >> fname;
    Family(fname, size);
}
Family::Family(string name, int size)
{
    fname = name;
    this->size = size;
    p = new Person[size];
    for (int i = 0; i < size; i++)
    {
        cout << "이름을 입력하세요 >> ";
        cin >> faname;
        p[i].setName(faname);
    }
    show();
}
Family::~Family()
{
    delete[] p;
}
void Family::show()
{
    cout << fname << "가족은 다음과 같이" << size << "명 입니다." << '\n';
    for (int i = 0; i < size; i++)
    {
        cout << i + 1 << " ) " << p[i].getName() << '\n';
    }
}
int main()
{
    Family *simpson = new Family;
    delete simpson;
    return 0;
}