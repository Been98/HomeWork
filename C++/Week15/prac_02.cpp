#include <iostream>
#include <string>
#include <vector>


using namespace std;

class Student
{
    string name;
    int id;

public:
    Student() = default;
    Student(string name, int id) : name(name), id(id){};
    ~Student() = default;
    void show()
    {
        cout << "name: " << name << ",   id: " << id << endl;
    }
};
class Manager
{
    vector<Student> vec;

public:
    void run();
    void print();
    void save();
};
void Manager::run()
{
    cout<<">>> 벡터에 학생 데이터를 저장합니다. <<<"<<endl;
    cout <<"학생 데이터를 입력하세요. 이름 입력시 fin을 입력하면 저장을 종료합니다."<<endl;
    save();
    print();
}
void Manager::save(){
    string a;
    int b;
    while (true)
    {
        cout << "name >>";
        cin >> a;
        if (a == "fin")
            break;
        cout << "id :";
        cin >> b;
        vec.push_back(Student(a, b));
    }
    cout << vec.size() << " 명의 학생이 저장되었습니다. " << endl;
}
void Manager::print()
{
    cout << ">>> 백터에 저장된 모든 학생 데이터를 출력합니다 <<< "<<endl;

    for(auto &a :vec){
        a.show();
    }
}
int main()
{
    Manager man;
    man.run();
}