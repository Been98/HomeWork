#include <iostream>
#include <string>
#include <algorithm>

using namespace std;

class Array
{
private:
    double *ptr;
    int size;

public:
    Array(int size); // size크기를 갖는 배열 동적 생성
    // Array(const Array& a){
    //     this->size = a.size;
    //     ptr = new double[size];
    //     for(int i =0; i <size; i++){
    //         ptr[i] = a.ptr[i];
    //     }
    // }
    ~Array();
    void show();
    //[]연산자와 = 연산자 중복
    double& operator[](int x);
    Array& operator=(Array& a);
};
Array::Array(int size){
    this->size = size;
    ptr = new double[size];

}
void Array::show(){
    for(int i =0; i < size; i++){
        cout <<ptr[i] <<"  ";
    }
    cout <<endl<<endl;
}
double& Array::operator[](int x){
    return ptr[x];
}
Array::~Array(){
    delete[] ptr;
}
Array& Array::operator=(Array& a){
    for(int i =0; i <size; i++){
        this->ptr[i] = a[i];
    }
    return *this;
}

int main()
{
    Array arr(5), brr(5);
    for (int i = 0; i < 5; i++)
    {
        cout << i + 1 << ") input>> ";
        cin >> arr[i];
    } 
    cout << "==== Value of arr====" << endl;
    arr.show();

    brr = arr;
    brr[2] = 34.5;
    brr[4] = 56.3;
    cout << "==== Value of brr====" << endl;
    brr.show();
    cout << "==== Value of arr====" << endl;
    arr.show();   
    return 0;
}