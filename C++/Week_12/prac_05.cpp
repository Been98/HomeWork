#include <iostream>
#include <string>
#include <algorithm>

using namespace std;

class SortedArray
{
    int size;    // 현재 배열의 크기
    int *p;      // 정수 배열에 대한 포인터
    void sort(){
        std::sort(p,p+size);
    } // 정수 배열을 오름차순으로 정렬

public:
    SortedArray();                  // p는 NULL로 size는 0으로 초기화
    SortedArray(SortedArray &src);  // 복사 생성자
    SortedArray(int p[], int size); // 생성자. 정수 배열과 크기를 전달받음
    ~SortedArray();                 // 소멸자
    SortedArray operator+(SortedArray &op2);
    SortedArray &operator=(const SortedArray &op2); // 현재 배열에 op2 배열을 복사
   
    int& operator[](int x);
    void show();                                    // 배열의 원소 출력
};
SortedArray::SortedArray(){
    p = nullptr;
    size = 0;
}
SortedArray::SortedArray(SortedArray &src){
    this->size = src.size;
    this->p = src.p;
}
SortedArray::SortedArray(int p[], int size){
    this->size = size;
    this->p = new int[size];
    for(int i = 0; i < size; i++){
        this->p[i] = p[i];
    }
}
SortedArray::~SortedArray(){
    delete[] p;
}
int& SortedArray::operator[](int x){
    return p[x];
}
SortedArray SortedArray::operator+(SortedArray& op2){
    SortedArray temp;
    temp.p = new int[size + op2.size];
    temp.size = size + op2.size;
    for(int i = 0; i < size; i++){
        temp[i] = this->p[i]; 
    }
    for(int i = size; i< size+op2.size; i++){
        temp[i] = op2[i-size];
    }
    return temp;
} 
SortedArray& SortedArray::operator=(const SortedArray &op2){
    size = op2.size;
    p = new int[op2.size];
    for(int i = 0; i<op2.size; i++){
        p[i] = op2.p[i];
    }
    return *this;
}

void SortedArray::show(){  
    sort();
    cout <<"배열 출력 : ";
    for(int i =0; i < size; i++){
        cout <<p[i]<<" ";
    }
    cout <<endl;
}
int main()
{
    int n[] = {2, 20, 6};
    int m[] = {10, 7, 8, 30};
    SortedArray a(n, 3), b(m, 4), c;

    c = a + b; 
    a.show();
    b.show();
    c.show();
}