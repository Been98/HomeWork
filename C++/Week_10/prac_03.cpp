#include <iostream>
#include <string>

using namespace std;

class Dept
{
    int size;    // scores 배열의 크기
    int *scores; // 동적 할당 받을 정수 배열의 주소
public:
    Dept(int size);           //매개변수로 받은 배열 크기만큼 scores 배열 생성
    Dept(Dept &dept);         //복사 생성자
    ~Dept();                  // 소멸자
    int getSize();            //배열 크기 반환
    void read();              // size 만큼 키보드에서 정수를 읽어 scores 배열에 저장
    bool isOver60(int index); // index의 학생의 성적이 60보다 크면 true 리턴
};
Dept::Dept(int size){
    this->size = size;
    scores = new int[size];
}
Dept::Dept(Dept &dept){
    this->size = dept.size;
    for(auto i =0; i< size; i ++){
        scores[i] = dept.scores[i];
    }
}
Dept::~Dept(){
    if(scores)
        delete[] scores;
}
int Dept::getSize(){
    return size;
}
void Dept::read(){
    cout << size << "개 점수 입력 >> " << endl;
    for(auto i =0; i < size; i++){
        cout <<i+1<<"] ";
        cin >> scores[i];
    }
}
bool Dept::isOver60(int index){
    if(scores[index] > 60)
        return true;
    return false;
}

int countPass(Dept &a);
int countPass(Dept &a){
    int count = 0;
    for(int i = 0; i < a.getSize(); i++ ){
        bool flag = a.isOver60(i);
        if(flag)
            count++;
    }
    return count;
}

int main()
{
    Dept *com;
    int cnt;
    cout << "학생 수를 입력하세요 >> ";
    cin >> cnt;
    com = new Dept(cnt);     //입력한 학생 수만큼 scores 배열 생성
    com->read();             //학생들의 성적을 키보드로부터 읽어 scores 배열에 저장
    int n = countPass(*com); // com 학과에 60점 이상으로 통과한 학생의 수를 리턴
    cout << "60점 이상은 " << n << "명" << endl;
    delete com;
}
