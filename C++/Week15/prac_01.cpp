#include <iostream>
#include <string>

using namespace std;

template <typename T>
class Dim
{
    T *ptr;                         // T 타입의 배열을 가리키는 포인터
    int size;                       //배열 크기
public :
    Dim(T *arr, int size){ptr = arr, this->size = size;}             //매개변수로 받은 배열과 배열크기를 멤버 변수로 대입
    void reverse();                 //배열에 저장된 데이터 순서를 역순으로 저장
    void swap(T &first, T &second); //배열 원소 교환
    void print();                   //배열 출력
};
template <typename T>
void Dim<T>::reverse(){
    int si = size/2;
    for(int i =0; i<=si/2; i++){
        swap(ptr[i],ptr[(size-1)-i]);
    }
}
template <typename T>
void Dim<T>::swap(T &f, T&s){
    T tmp;
    tmp = f;
    f = s;
    s = tmp;
}
template <typename T>
void Dim<T>::print(){
    cout <<"Original array"<<endl;
    for(int i= 0; i <size; i++){
        cout <<ptr[i]<<"  ";
    }
    cout <<endl<<"Reversed array"<<endl;
    reverse();
    for (int i = 0; i < size; i++)
    {
        cout << ptr[i]<<"  ";
    }
    cout <<endl<<endl;
}
int main(){
    int arr1[] = {3, 7, 2, 12, 14};
    double arr2[] = {22.7, 14.2, 3.8, 12.23, 11.2};
    char arr3[] = {'C', 'a', 'B', 'E', 'N', 'Q'};
    string arr4[] = {"John", "Lu", "Mary", "Su"};
    Dim<int> a1(arr1,5);
    Dim<double> a2(arr2, 5);
    Dim<char> a3(arr3, 6);
    Dim<string> a4(arr4, 4);
    a1.print();
    a2.print();
    a3.print();
    a4.print();
}
