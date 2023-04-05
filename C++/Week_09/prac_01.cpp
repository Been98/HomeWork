#include <iostream>
#include <string>

using namespace std;


class Fraction
{
    int numer; //분자
    int denom; //분모
public:
    Fraction(int num, int den); //매개변수가 있는 생성자
    Fraction();                 //디폴트 생성자
    ~Fraction(){;}

    int getNumer() const{return numer;}
    int getDenom() const{return denom;}

    void setNumer(int num){numer = num;}
    void setDenom(int den){denom = den;}
    void print() const; //분수 출력
    void add(Fraction& fr1, Fraction& fr2);
    void mul(Fraction &fr1, Fraction &fr2);

private:
    void normalize();      // gcd() 함수를 사용하여 기약분수로 처리
    int gcd(int n, int m); //분모와 분자의 최대 공약수
};

Fraction &findLargest(Fraction &fr1, Fraction &fr2, Fraction &fr3);
Fraction &findLarger(Fraction &fract1, Fraction &fract2);
    
void Fraction::mul(Fraction &fr1, Fraction &fr2){
    numer = fr1.getNumer() * fr2.getNumer();
    denom = fr1.getDenom() * fr2.getDenom();
    normalize();
    cout << numer<<"/"<<denom<<endl;
}
void Fraction::add(Fraction &fr1, Fraction &fr2){
    numer = fr1.getDenom() * fr2.getNumer() +fr2.getDenom() * fr1.getNumer();
    denom = fr1.getDenom() * fr2.getDenom();
    normalize();
    cout << numer << "/" << denom << endl;
}
Fraction::Fraction(int num, int den){
    numer = num;
    denom = den;
    normalize();
}
Fraction::Fraction(){
   
}
void Fraction::print() const {
    cout << numer <<" / "<<denom<<endl;
}
void Fraction::normalize(){
    int n = numer, d = denom;
    n /= gcd(numer, denom);
    d /= gcd(numer, denom);
    setNumer(n);
    setDenom(d);
}
int Fraction::gcd(int n,int m){
    int result = 1;
    for(int i = 2 ; i < m; i++){
        if(n % i ==0 && m % i == 0){
            result = i;
        }
    }
    return result;
}
Fraction &findLargest(Fraction &fr1, Fraction &fr2, Fraction &fr3){
    return findLarger(findLarger(fr1,fr2),fr3);
}
Fraction &findLarger(Fraction &fract1, Fraction &fract2){
    if(fract1.getNumer()*fract2.getDenom() > fract2.getNumer() * fract1.getDenom()){
        return fract1;
    }
    return fract2;
}

int main()
{

    cout << "다음과 같은 분수에서 가장 큰 분수를 찾습니다 "<<endl;
    Fraction fract1(12, 15);
    Fraction fract2(6, 9);
    Fraction fract3(4, 11);
    cout << "fract1 : "<<fract1.getNumer()<<"/"<<fract1.getDenom()<<endl;
    cout << "fract2 : " << fract2.getNumer() << "/" << fract2.getDenom() << endl;
    cout << "fract3 : " << fract3.getNumer() << "/" << fract3.getDenom() << endl;
    Fraction a = findLargest(fract1,fract2,fract3);
    cout << "가장 큰 분수 : " << a.getNumer() <<"/"<<a.getDenom()<<endl;
    Fraction fract4(2, 12);
    Fraction fract5(15, 25);
    Fraction product;
    cout << "다음과 같은 분수에 대하여 곱셈과 덧셈 연산을 합니다 "<<endl;
    cout << "fract1 : " << fract4.getNumer() << "/" << fract4.getDenom() << endl;
    cout << "fract2 : " << fract5.getNumer() << "/" << fract5.getDenom() << endl;
    cout << "The result of multiplying is : ";
    product.mul(fract4,fract5);
    cout << "The result of adding is : ";
    product.add(fract4,fract5);

}