#include <iostream>
#include <string>

using namespace std;

class Book
{
    string title;
    int price, pages;
public:
    Book(string title = "", int price = 0, int pages = 0);
    void show();
    string getTitle(); // title 반환
    Book &operator+=(int price);
    Book &operator-=(int price);
    bool operator==(int price);
    bool operator==(string title);
    bool operator==(Book b);
};
Book::Book(string title, int price, int pages){
    this->title = title;
    this->price = price;
    this->pages = pages;
}
string Book::getTitle(){
    return title;
}
void Book::show(){
    cout << title <<' '<<price <<"원"<<pages<<" 페이지"<<endl;
}
Book& Book::operator+=(int price){
    this ->price += price;
    return *this;
}
Book &Book::operator-=(int price)
{
    this->price -= price;
    return *this;
}

bool Book::operator==(int price){
    if(this->price == price)
        return true;
    return false;
}
bool Book::operator==(string title)
{
    if (this->title == title)
        return true;
    return false;
}
bool Book::operator==(Book b)
{
    if (this->getTitle() == b.getTitle())
        return true;
    return false;
}
int main()
{
    Book a("청춘", 20000, 300), b("미래", 30000, 500);
    a += 500; // 책 a의 가격 500원 증가
    b -= 500; // 책 b의 가격 500원 감소
    a.show();
    b.show();

    Book b1("명품 C++", 30000, 500), b2("고품 C++", 30000, 500);
    if (b1 == 30000)
        cout << "정가 30000원" << endl; // price 비교
    if (b1 == "명품 C++")
        cout << "명품 C++ 입니다." << endl; // 책 title 비교
    if (b1 == b2)
        cout << "두 책이 같은 책입니다." << endl; // title, price, pages 모두 비교
}
