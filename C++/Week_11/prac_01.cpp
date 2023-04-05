#include <iostream>
#include <string>

using namespace std;


class Person
{
    int id;
    double weight;
    string name;

public:
    Person(int i = 1, string n = "Grace", double w = 20.5);
    void show();
};
Person::Person(int i, string n, double w)
{
    id = i;
    weight = w;
    name = n;
}
void Person::show()
{
    cout << "id : " << id << " weight : " << weight << " name : " << name << endl;
}

int main()
{
    Person grace, ashley(2, "Ashley"), helen(3, "Helen", 32.5); // id, name
    grace.show();
    ashley.show();
    helen.show();
}