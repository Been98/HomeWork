#include <iostream>
#include <string>

using namespace std;
class Ram
{
    char mem[100 * 1024]; // 100KB 메모리
    int size;

public:
    Ram();                               // mem을 0으로 초기화하고 size를 100*1024로 초기화
    ~Ram();                              // "메모리 제거됨" 문자열 출력
    char read(int address);              // address 주소의 메모리를 읽어 리턴
    void write(int address, char value); // address 주소에 value 저장
};

int main()
{
    Ram ram;
    ram.write(100, 20);    // 100 번지에 20 저장
    ram.write(101, 30);    // 101 번지에 30 저장
    ram.write(400000, 37); // 400000 번지에 37 저장

    cout << "ram.read(345000) :" << (int)(ram.read(345000)) << endl; //주소 범위를 벗어나면 -1 반환
    char res = ram.read(100) + ram.read(101);                        // 20 + 30 = 50
    ram.write(102, res);                                             // 102 번지에 50 저장
    cout << "102 번지의 값 = " << (int)ram.read(102) << endl;        // 102 번지 메모리 값 출력
    cout << "program finish" << endl;

    return 0;
}