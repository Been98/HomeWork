#include <iostream>
#include <string>

using namespace std;

class Converter
{
protected:
    double ratio;
    virtual double convert(double src) = 0; // src를 다른 단위로 변환한다.
    virtual string getSourceString() = 0;   // 소스 단위 명칭
    virtual string getDestString() = 0;     // dest 단위 명칭
public:
    Converter(double ratio) { this->ratio = ratio; }
    void run()
    {
        double src;
        cout << getSourceString() << "을 " << getDestString() << "로 바꿉니다. ";
        cout << getSourceString() << "을 입력하세요>> ";
        cin >> src;
        cout << "변환 결과 : " << convert(src) << getDestString() << endl;
    }
};
class KmToMile:public Converter{
protected:
    double convert(double src){
        return src / 1.609;
        ;
    }
    string getSourceString(){
        return "km";
    }
    string getDestString(){
        return "Mile";
    }
public:
    KmToMile(double ratio):Converter(ratio){}
};
class WonToDollar:public Converter{
protected:
    double convert(double src){
        return src/1010;
    }
    string getSourceString(){
        return "원";
    }
    string getDestString(){
        return "달러";
    }

public:
    WonToDollar(double ratio) : Converter(ratio) {}
};

int main()
{
    KmToMile toMile(1.609344); // 1mile은 1.609344 Km
    WonToDollar wd(1010);      // 1 달러에 1010원
    Converter *cp = &toMile;
    cp->run();
    cp = &wd;
    cp->run();
}
