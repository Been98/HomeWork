#include <iostream>
#include <string>

using namespace std;

bool palin(int a);

int main()
{
    int size = 0;
    cout <<"양의 정수를 입력하세요 :";
    cin  >> size;

    if(palin(size))
        cout <<size <<" 는 회문수 입니다"<<endl;
    else
        cout <<size << "는 ㄴㄴ "<<endl;
    return 0;
}
bool palin(int num){
    int value1 = num;
    int value2 =0;

    while(true){
        value2 += value1 % 10;
        value1 = value1 / 10;
        if(value1 <= 0){
            if(value2 == num)
                return true;
            else
                return false;
        }
        value2 *= 10;
    }
}