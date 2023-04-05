#include <iostream>
#include <cstring>
#include <vector>
#include <string>

using namespace std;

class MyClass
{
    int size;
    int *element;
public :
    MyClass(int size){
        this->size = size;
        element = new int[size];
        for(int i =0; i <size; i++)
            element[i] = 0;
    }
    MyClass(const MyClass &a){
        this->size = a.size;
        element = new int[size];
        for(int i =0; i < this->size; i++){
            this->element[i] = a.element[i];
        }
    }
    MyClass(MyClass &&a) noexcept{
        size = a.size;
        element = a.element;
        a.size = 0;
        a.element = nullptr;
    }
    ~MyClass(){
        delete []element;
    }
    void write(const string &&a){
        cout << "=== "<<a<<" ==="<<endl;
        for(int i = 0; i < this->size; i++){
            cout << "\t"<<element[i];
        }
        cout<<endl;
    }
    void change(int a, int b){
        element[a] = b;
    }
};
void print(MyClass &&a,string &&b){
    a.write(move(b));
};

int main()
{
    MyClass my{5}; //기본생성자 호출 
    my.write("original(my)");
    my.change(2, 30);
    my.change(4, 15);
    my.write("change(my)");
    MyClass copy(my); //복사생성자 호출
    copy.write("copy after");
    my.write("original(my)");
    copy.change(1, 23);
    copy.change(4, 61);
    print(move(copy), "change(copy)"); //이동생성자 호출 
}
 
 