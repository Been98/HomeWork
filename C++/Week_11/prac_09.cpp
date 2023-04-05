#include <iostream>
#include <string>

using namespace std;

class Big
{
public:
    Big() = default;
    string big(string a, string b); // a와 b 중 큰 문자열 리턴
    int big(char a[], int size);    // 배열 a에 저장된 문자 중 아스키 코드 값이 큰 문자의 인덱스 리턴
};
string Big::big(string a, string b){
    return a > b ? a : b;
}
int Big::big(char a[],int size){
    int max = 0;
    for(int i =1; i<size; i++){
        if(a[max] < a[i])
            max = i;
    }
    return max;
}

int main()
{
    Big a;
    char ch[] = {'d', 'a', 'e', 'A', 'p', 'x', 'q'};
    cout << "1"<<a.big("list","array")<<endl;
    cout << ch[a.big(ch,7)];
}