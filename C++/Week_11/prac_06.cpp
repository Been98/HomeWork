#include <iostream>
#include <string>

using namespace std;

class ArrayUtility2
{   
    int *arr1;
    int *arr2;
public:
    static int *concat(int s1[], int s2[], int size); 
    // s1과 s2를 연결한 새로운 배열을 동적 생성하고 포인터 리턴
    // s1에서 s2에 있는 숫자를 모두 삭제한 새로운 배열을 동적 생성하여 리턴
    static int *remove(int s1[], int s2[], int size, int &retSize);
};
int* ArrayUtility2::concat(int s1[],int s2[],int size){
    int *arr1 = new int[size];
    for(int i =0; i <5; i++){
        arr1[i] = s1[i];
    }
    for(int i =5; i <10; i++){
        arr1[i] = s2[i%5];
    }
    return arr1;
}
int* ArrayUtility2::remove(int s1[],int s2[],int size, int &retSize){
    int *arr2 = new int[retSize];
    for(int i =0; i <retSize; i++){
        int count = s1[i] - s2[i];
        if(count < 0)
            count *= -1;
        arr2[i] = count;
    }
    return arr2;
}

int main()
{
    ArrayUtility2 a;
    int b[5];
    int c[5];
    int size = 0;
    cout <<"정수를 5개 입력하라. 배열 x에 삽입한다 >>";
    for(int i = 0; i < 5; i++){
        cin >> b[i];
    }
    cout << "정수를 5개 입력하라. 배열 y에 삽입한다 >>";
    for (int i = 0; i < 5; i++)
    {
        cin >> c[i];
    }
    cout <<"합친 정수 배열을 출력한다 "<<endl;
    int *result = ArrayUtility2::concat(b,c,10);
    for(int i = 0; i < 10; i++){
        cout <<result[i]<<"  ";
    }
    cout <<endl <<"배열 x[] 에서 y[]를 뺀 결과를 출력한다." << "개수는 ";
    cin >>size;
    result = a.remove(b,c,5,size);
    for(int i =0; i< size; i++){
        cout <<result[i]<<"  ";
    }
    cout <<endl;
    delete[] result;
    a.~ArrayUtility2();
}

