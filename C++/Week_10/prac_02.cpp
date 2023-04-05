#include <iostream>
#include <string>
#include <iomanip>

using namespace std;

class MyClass{
    int size;
    int *element;
public:
    MyClass(int size);
    ~MyClass();   
    MyClass(MyClass& my);
    void write(string&& a);
    void change(int&& a,int&& b); 
};
MyClass::MyClass(int size) : size(size),element(new int[size]){
    for(auto i = 0; i < size; i++){
        element[i] = 0;
    }
}
MyClass::MyClass(MyClass& my){
    size = my.size;
    element = new int[size];
    for(auto i = 0; i <size; i++){
        element[i] = my.element[i];
    }
}
MyClass::~MyClass(){
    if(!element) //ㅂㅐ여ㄹ이 동ㅓㄱ할당이 되ㅆㅡㄴ가
        delete[] element;
}
void MyClass::write(string&& a){
    cout <<"==== "<< a<<" ===="<<endl;
    for(int i = 0; i< size; i++){
        cout << setw(4) << element[i];
    }
    cout <<endl;
}
void MyClass::change(int&& a, int&& b){
    element[a] = b;
}

void print(MyClass &&m, string&& b);
void print(MyClass &&my, string&& b){ 
    my.write(move(b));
}

int main()
{
    MyClass my{5};
    my.write("original(my)");
    my.change(2, 30);
    my.change(4, 15);
    my.write("change(my)");
    MyClass copy(my);  //복사 
    copy.write("copy after");
    my.write("original(my)");
    copy.change(1, 23);
    copy.change(4, 61);
    print(move(copy), "change(copy)");
}


