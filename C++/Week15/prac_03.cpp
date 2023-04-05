#include <iostream>
#include <string>
#include <vector>

using namespace std;

class Book
{
    string title;  // 책 이름
    string author; // 저자
    int year;      //출판년도
public:
    Book(){};
    Book(string title, string author, int year):title(title), author(author),year(year){};
    string getAuthor(){return author;}
    int getYear(){return year;}
    void show(); //도서 정보 출력
};
void Book::show()
{
    cout <<year<<"년도 , "<<title<<", "<<author<<endl;
}
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
void BookManager::searchByAuthor(){
    string a;
    cout <<"검색하고자 하는 저자 이름을 입력하세요>>";
    cin >> a;
    for(auto &vec:v){
        if(a==vec->getAuthor()){
            vec->show();
            break;
        }
        else{
            cout <<"검색 결과가 없습니다."<<endl;
        }
    }
}
void BookManager::searchByYear()
{
    int a;
    cout << "검색하고자 하는 년도를 입력하세요>>";
    cin >> a;
    for (auto &vec : v)
    {
        if (a == vec->getYear())
        {
            vec->show();
            break;
        }
        else
        {
            cout << "검색 결과가 없습니다." << endl;
        }
    }
}
void BookManager::bookIn()
{
    int y;
    string t, a;
    cout << "입고할 책을 입력하세요. 년도에 -1을 입력하면 입고를 종료합니다."<<endl;
    while(true){
        cout <<"년도 >>";
        cin >> y;
        if(y == -1){
            break;
        }
        cout << "책이름>>";
        cin >> t;
        cout <<"저자 >>";
        cin >> a;
        v.push_back(new Book(t, a, y));

    }
    cout << "총 입고된 책은 "<<v.size()<<"권 입니다."<<endl;
}
void BookManager::finish()
{
    for(auto &vv : v){
        cout << vv->getAuthor()<< " 메모리 반납 완료"<<endl;
        delete vv;
    }
}
void BookManager::run()
{
    bookIn();         // 입고
    searchByAuthor(); // 저자로 검색
    searchByYear();   // 년도로 검색
    finish();
}

int main()
{
    BookManager man;
    man.run();
}
