#include <iostream>
#include <string>
#include <vector>

using namespace std;

class Board{
inline static vector<string> v;
inline static string text;
public:
    Board() =default;
    static void add(string &&t);
    static void print();
};
void Board::add(string &&t){
    v.push_back(t);
}
void Board::print(){
    for(auto &vv: v){
        cout << vv<< endl;
    }
}

int main()
{
    Board::add("기말고사는 대면 시험입니다.");
    Board::add("코딩 라운지 많이 이용해 주세요.");
    Board::print();
    Board::add("북카페 많이 이용해 주세요");
    Board::add("SW Week 행사에 많이 참여해 주세요");
    Board::print();
}
