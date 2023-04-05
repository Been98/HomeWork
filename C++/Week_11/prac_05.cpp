#include <iostream>
#include <string>
#include <ctime>
#include <cstdlib>
#include <iomanip>

using namespace std;

class Random
{
public:
    static int nextInt(int min = 0, int max = 32767); // min과 max 사이의 랜덤 정수 리턴
    static char nextAlphabet();                       //랜덤하게 영문자 반환
    static string nextString(int length);             //매개변수로 전달된 길이를 갖는 임의의 문자열 반환
};
int Random::nextInt(int min, int max){
    return rand()%max;
}
char Random::nextAlphabet(){
    return static_cast<char>(65 + rand() % 26);
}
string Random::nextString(int length){
    string result = "";
    int count = 0;
    for(int i =0; i < length; i++){
        result += static_cast<char>(65+rand()%26);
    }
    return result;
}
int main()
{
    srand(time(nullptr));
    Random r;
    cout << "1에서 100까지 랜덤한 정수 10개를 출력합니다"<<endl;
    for(int i =0 ; i < 10; i ++){
        cout<<r.nextInt(0,100)<<setw(4);
    }
    cout <<endl<< "알파벳을 랜덤하게 10개를 출력합니다."<<endl;
    for(int i =0; i <10; i++){
        cout <<r.nextAlphabet()<<setw(4);
    }
    cout <<endl<<"길이가 5~10인 랜덤한 문자열 5개를 출력합니다"<<endl;
    for(int i =0; i < 5; i++){
        int size = 5+rand()%5;
        cout<<r.nextString(size)<<": (" << size <<" )"<<endl;
    }    
}