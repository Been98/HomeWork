#include <iostream>

using namespace std;

void add(double b);

//가장 큰 값을 찾고자 하는 분수
Fraction fract1(12, 15);
Fraction fract2(6, 9);
Fraction fract3(4, 11);

//곱셈과 덧셈 연산을 수행하는 분수
Fraction fract1(2, 12);
Fraction fract2(15, 25);
Fraction product; //연산 결과를 저장하는 분수

class Fraction
{
    int numer; //분자
    int denom; //분모
public:
    Fraction(int num, int den); //매개변수가 있는 생성자
    Fraction();                 //디폴트 생성자
    ~Fraction();

    int getNumer() const {return numer;} //접근자
    int getDenom() const {return denom;}

    void setNumer(int num){numer = num;} //설정자
    void setDenom(int den){denom = den;}
    void print() const; //분수 출력
private:
    void normalize();      // gcd() 함수를 사용하여 기약분수로 처리
    int gcd(int n, int m); //분모와 분자의 최대 공약수
};
void Fraction::print() const{

}
void Fraction::normalize(){
    gcd(numer,denom);
}
