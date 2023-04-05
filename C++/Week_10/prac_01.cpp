#include <iostream>
#include <string>
#include <vector>
#include <string.h>

using namespace std;

class Book
{
   char *title; // 제목 문자열
   int price;   // 가격
   int size;
public:
    Book(const char *title, int price);
    Book(const Book &b);
    Book(Book && b) noexcept;
    ~Book();
    void set(const char *title, int price);
    void show() { cout << title << "" << price << "원" << endl; }
};
Book::Book(const char *ti, int pr){
    price = pr;
    size = strlen(ti);
    this->title = new char[size + 1];
    strcpy(this->title, ti);
}
Book::Book(Book &&b) noexcept{
    price = b.price;
    title = b.title;
    b.title = nullptr;
    b.price = 0;
}
Book::~Book(){
    delete []title;
}
Book::Book(const Book &b){
    this->price = b.price;
    size = strlen(b.title);
    this->title = new char[size+1];
    strcpy(this->title,b.title);
}
void Book::set(const char *title, int price){
    if(this->title){
        delete[] this->title;
    }
    size = strlen(title);
    this->price = price;
    this->title = new char[size +1];
    strcpy(this->title,title);
    
}
int main()
{
    Book cpp("명품C++", 10000);
    Book java = cpp;
    java.set("명품자바", 12000);
    cpp.show();
    java.show();
    vector<Book> b;
    b.push_back(Book("명품파이썬", 300));
    b.at(0).show();
    Book book(Book{"명품스크립트", 34000});
    book.show();
}
