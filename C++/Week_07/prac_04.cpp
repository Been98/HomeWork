#include <iostream>

using namespace std;

class Sample
{
private:
    int x;

public:
    int getX() const;
};

int main(){
    //Sample s1(4); // aoroqustn
    Sample s2();  //  컴파일러가 자동 생성하는거 아니야?
    Sample s3{};
}