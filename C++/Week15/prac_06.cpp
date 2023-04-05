#include <iostream>
#include <string>
#include <vector>

//vector <Book*> 면 동적 할당으로 받아오고 처리도 포인터 처리하듯 해야한다.
using namespace std;

class Book
{
    string title;  // 책 이름
    string author; // 저자
    int year;      //출판년도
public:
    Book(){};
    Book(string title, string author, int year){
        this->title = title;
        this->author = author;
        this->year = year;
    }
    string getAuthor(){return author;}
    int getYear(){return year;}
    void show(){
        cout <<year << "년도,"<<title<<", "<<author <<endl;
    } //도서 정보 출력
};
class BookManager
{
    vector<Book *> v;      // Book 객체를 저장하기위한 vetor 객체 생성
    void searchByAuthor(); //저자로 검색
    void searchByYear();   //연도로 검색
    void bookIn();         //벡터에 Book 정보 저장
    void finish();

public:
    void run();
};
void BookManager::run()
{
    bookIn();         // 입고
    searchByAuthor(); // 저자로 검색
    searchByYear();   // 년도로 검색
    finish();
}
void BookManager::bookIn(){
    string t, a;
    int y;
    cout << "입고할 책을 입력. 년도에 -1 입력시 종료"<<endl;
    while(true){
        cout << "년도 >>";
        cin >> y;
        if(y == -1)
            break;
        cout <<"책이름>>";
        cin >> t;
        cout <<"저자>>";;
        cin >>a;
        v.emplace_back(new Book(t, a, y));
    }
    cout << "총 입고된 책은 "<<v.size()<<"권 입니다."<<endl;
}
void BookManager::searchByAuthor(){
    string au;
    bool flag = true;
    cout << "검색하고자 하는 저자 이름 입력 >>";
    cin >>au;
    for(auto a : v){
        if(a->getAuthor() == au){
            a->show();
            flag = false;
        }
    }
    if(flag)
        cout << "찾으시는 자료가 없습니다"<<endl;
}
void BookManager::searchByYear()
{
    int au;
    bool flag = true;
    cout << "검색하고자 하는 저자 이름 입력 >>";
    cin >> au;
    for (auto a : v)
    {
        if (a->getYear() == au)
        {
            a->show();
            flag = false;
        }
    }
    if (flag)
        cout << "찾으시는 자료가 없습니다" << endl;
}
void BookManager::finish(){
    for(auto a:v){
        cout<< a->getAuthor() <<"메모리 반납 완료"<<endl;
        delete a;
    }
}
int main()
{
    BookManager man;
    man.run();
}
